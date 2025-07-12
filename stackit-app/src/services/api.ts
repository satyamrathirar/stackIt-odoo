import { supabase } from '@/lib/supabase'
import { Question, Answer, Vote } from '@/types/database'

export const api = {
  // Questions
  async getQuestions(page = 1, limit = 5) {
    const offset = (page - 1) * limit
    const { data, error, count } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    return { data, error, count }
  },

  async getQuestion(id: number) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  async createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single()
    
    return { data, error }
  },

  // Answers
  async getAnswers(questionId: number) {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', questionId)
      .order('is_accepted', { ascending: false })
      .order('votes', { ascending: false })
    
    return { data, error }
  },

  async createAnswer(answer: Omit<Answer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answer)
      .select()
      .single()
    
    return { data, error }
  },

  // Voting
  async voteQuestion(userId: string, questionId: number, voteType: number) {
    const { data, error } = await supabase
      .from('votes')
      .upsert({
        user_id: userId,
        question_id: questionId,
        vote_type: voteType
      }, {
        onConflict: 'user_id,question_id'
      })
    
    return { data, error }
  },

  async voteAnswer(userId: string, answerId: number, voteType: number) {
    const { data, error } = await supabase
      .from('votes')
      .upsert({
        user_id: userId,
        answer_id: answerId,
        vote_type: voteType
      }, {
        onConflict: 'user_id,answer_id'
      })
    
    return { data, error }
  }
}