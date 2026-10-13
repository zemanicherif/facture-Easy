'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const errorMessages: Record<string, string> = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'Email not confirmed': "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail.",
  'User already registered': 'Un compte existe déjà avec cet email. Connectez-vous.',
  'Password should be at least 6 characters': 'Le mot de passe doit faire au moins 6 caractères.',
  'Unable to validate email address: invalid format': 'Format d\'email invalide.',
  'signup is disabled': 'Les inscriptions sont désactivées pour le moment.',
}

function translateError(message: string): string {
  return errorMessages[message] || message
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    redirect('/login?error=' + encodeURIComponent('Veuillez remplir tous les champs.'))
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(translateError(error.message)))
  }

  revalidatePath('/', 'layout')
  redirect('/choose-plan')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('Veuillez remplir tous les champs.'))
  }

  if (password.length < 6) {
    redirect('/login?error=' + encodeURIComponent('Le mot de passe doit faire au moins 6 caractères.'))
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // L'email de confirmation est désactivé côté Supabase Dashboard
      // L'utilisateur est connecté directement après inscription
      emailRedirectTo: undefined,
    }
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(translateError(error.message)))
  }

  // Si l'utilisateur n'est pas confirmé (confirmation email activée côté Supabase),
  // on le redirige vers /login avec un message explicatif
  if (data.user && !data.session) {
    redirect('/login?error=' + encodeURIComponent('Compte créé ! Vérifiez votre boîte email pour confirmer votre inscription, puis connectez-vous.'))
  }

  revalidatePath('/', 'layout')
  redirect('/choose-plan')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
