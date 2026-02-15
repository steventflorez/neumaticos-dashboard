import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { SESSION_KEY, PROFILE_KEY } from './authKeys';
import { AuthContext } from './AuthContextCore';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [profile, setProfile] = useState(() => {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [loading, setLoading] = useState(true);
    const loginInProgressRef = useRef(false);

    // Fetch profile with a hard timeout via Promise.race
    const fetchProfile = useCallback(async (userId) => {
        if (!userId) return null;
        console.log('[Auth] Fetching profile for:', userId);

        try {
            // Using limit(1) instead of single() to avoid errors if 0 rows
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .limit(1);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timed out (5s)')), 5000)
            );

            const result = await Promise.race([profilePromise, timeoutPromise]);

            if (result.error) {
                console.error('[Auth] Error fetching profile:', result.error);
                return null;
            }

            const data = result.data && result.data.length > 0 ? result.data[0] : null;
            console.log('[Auth] Profile fetched:', data ? 'Found' : 'Not found');
            return data;
        } catch (err) {
            console.error('[Auth] fetchProfile exception:', err.message);
            return null;
        }
    }, []);

    function saveToStorage(sessionUser, userProfile) {
        try {
            if (sessionUser) localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            if (userProfile) localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
        } catch (e) {
            console.error('[Auth] Storage save error:', e);
        }
    }

    function clearStorage() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(PROFILE_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(PROFILE_KEY);
    }

    useEffect(() => {
        let isMounted = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[Auth] Event:', event);

                if (event === 'INITIAL_SESSION') {
                    if (session?.user) {
                        console.log('[Auth] Restoring session for:', session.user.email);
                        setTimeout(async () => {
                            const userProfile = await fetchProfile(session.user.id);
                            if (isMounted) {
                                setUser(session.user);
                                setProfile(userProfile);
                                saveToStorage(session.user, userProfile);
                                setLoading(false);
                                console.log('[Auth] Ready (restored)');
                            }
                        }, 0);
                    } else {
                        console.log('[Auth] No session on load');
                        if (isMounted) {
                            setUser(null);
                            setProfile(null);
                            clearStorage();
                            setLoading(false);
                            console.log('[Auth] Ready (no session)');
                        }
                    }
                } else if (event === 'SIGNED_IN') {
                    if (loginInProgressRef.current) {
                        console.log('[Auth] SIGNED_IN skipped (login handling it)');
                        return;
                    }
                    if (session?.user && isMounted) {
                        setTimeout(async () => {
                            const userProfile = await fetchProfile(session.user.id);
                            if (isMounted) {
                                setUser(session.user);
                                setProfile(userProfile);
                                saveToStorage(session.user, userProfile);
                            }
                        }, 0);
                    }
                } else if (event === 'TOKEN_REFRESHED') {
                    if (session?.user && isMounted) {
                        setUser(session.user);
                        saveToStorage(session.user, null);
                    }
                } else if (event === 'SIGNED_OUT') {
                    if (isMounted) {
                        setUser(null);
                        setProfile(null);
                        clearStorage();
                    }
                }
            }
        );

        const safety = setTimeout(() => {
            if (isMounted && loading) {
                setLoading(false);
                console.warn('[Auth] Safety timeout');
            }
        }, 8000);

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            clearTimeout(safety);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Login
    async function login(email, password) {
        console.log('[Auth] Login start');
        loginInProgressRef.current = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            console.log('[Auth] Sign in OK, fetching profile...');

            // Small delay to let Supabase set auth headers internally
            await new Promise(r => setTimeout(r, 100));

            // We use Promise.race inside fetchProfile so it shouldn't hang
            const userProfile = await fetchProfile(data.user.id);
            console.log('[Auth] Login complete, profile:', userProfile ? 'Found' : 'Not found');

            setUser(data.user);
            setProfile(userProfile);
            saveToStorage(data.user, userProfile);

            // Ensure loading is set to false even if profile fetch failed
            setLoading(false);

            return { user: data.user, profile: userProfile };
        } catch (err) {
            console.error('[Auth] Login error:', err);
            setLoading(false); // Ensure loading is cleared on error
            throw err;
        } finally {
            loginInProgressRef.current = false;
        }
    }

    // Logout
    async function logout() {
        console.log('[Auth] Logging out...');
        setUser(null);
        setProfile(null);
        clearStorage();
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('[Auth] Sign out error:', err);
        }
    }

    function hasRole(role) {
        return profile?.role === role;
    }

    function isAdmin() {
        return profile?.role === 'administrador';
    }

    const value = {
        user,
        profile,
        loading,
        login,
        logout,
        hasRole,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
