// src/services/authService.js
import { supabase } from './supabase';

export async function signUpUser({ email, password, role, fullName, institutionName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return { error };

  const user = data.user;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email,
    role,
    full_name: fullName,
    institution_name: role === 'issuer' ? institutionName : null
  });

  if (profileError) return { error: profileError };

  return { user };
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { error };

  const user = data.user;

  // Fetch the user's profile (to get their role)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) return { error: profileError };

  return { user, role: profile.role };
}
