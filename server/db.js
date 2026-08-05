import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

export async function findSubscriberByEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSubscriber(subscriber) {
  const { data, error } = await supabase
    .from('subscribers')
    .upsert(subscriber, { onConflict: 'email' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function confirmSubscriber(confirmToken) {
  const { data, error } = await supabase
    .from('subscribers')
    .update({ confirmed: true, confirm_token: null, start_date: new Date().toISOString().slice(0, 10) })
    .eq('confirm_token', confirmToken)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unsubscribeSubscriber(unsubscribeToken) {
  const { data, error } = await supabase
    .from('subscribers')
    .update({ unsubscribed: true })
    .eq('unsubscribe_token', unsubscribeToken)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listConfirmedSubscribers() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('confirmed', true)
    .eq('unsubscribed', false);
  if (error) throw error;
  return data;
}

export async function updateLastSentDay(id, day) {
  const { error } = await supabase
    .from('subscribers')
    .update({ last_sent_day: day })
    .eq('id', id);
  if (error) throw error;
}

export async function listChallenges() {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('day');
  if (error) throw error;
  return data;
}

export async function getChallengeByDay(day) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('day', day)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function challengeCount() {
  const { count, error } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count;
}

export async function seedChallenges(seedData) {
  const { error } = await supabase.from('challenges').upsert(seedData, { onConflict: 'day' });
  if (error) throw error;
}

export async function updateChallenge(day, fields) {
  const { data, error } = await supabase
    .from('challenges')
    .update(fields)
    .eq('day', day)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createChallenge(challenge) {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChallenge(day) {
  const { error } = await supabase.from('challenges').delete().eq('day', day);
  if (error) throw error;
}
