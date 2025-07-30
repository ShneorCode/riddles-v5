import { supabase } from '../db/supabaseClient.js';

const TABLE_NAME = 'users';

export async function getUserByUsername(username) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('username', username)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user by username from Supabase:', error.message);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Unexpected error in getUserByUsername:', error.message);
        throw error;
    }
}

export async function createUser(username, passwordHash, role = 'user') {
    console.log('Attempting to create user with:');
    console.log('  Username:', username);
    console.log('  Password Hash (first 10 chars):', passwordHash ? passwordHash.substring(0, 10) + '...' : 'null');
    console.log('  Role:', role);

    try {
        const { error: insertError } = await supabase
            .from(TABLE_NAME)
            .insert({ username, password_hash: passwordHash, role });

        if (insertError) {
            console.error('Supabase error creating user:', insertError.message);
            console.error('Supabase insert error details:', insertError);
            return null;
        }
        
        console.log('Supabase insert operation completed successfully. Now attempting to retrieve the new user.');

        const newUser = await getUserByUsername(username);

        if (newUser) {
            console.log('Successfully retrieved new user after creation:', newUser);
            return newUser;
        } else {
            console.error('User created successfully, but failed to retrieve user data after creation.');
            return null;
        }
    } catch (error) {
        console.error('Unexpected error in createUser (catch block):', error.message);
        console.error('Full unexpected error:', error);
        return null;
    }
}