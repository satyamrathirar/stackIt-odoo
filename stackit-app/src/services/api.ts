import { supabase } from '@/lib/supabase'
import { Question, Answer, Vote } from '@/types/database'

export const api = {
  // Questions
  async getQuestions(page = 1, limit = 5, searchQuery = '') {
    const offset = (page - 1) * limit
    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' })
    
    if (searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
    }
    
    const { data, error, count } = await query
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
  async getUserVoteForQuestion(userId: string, questionId: number) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single()
    
    return { data, error }
  },

  async getUserVoteForAnswer(userId: string, answerId: number) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', userId)
      .eq('answer_id', answerId)
      .single()
    
    return { data, error }
  },

  async voteQuestion(userId: string, questionId: number, voteType: number) {
    // First, check if user has already voted
    const { data: existingVote, error: getVoteError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single()
    
    let voteChange = voteType;
    if (!getVoteError && existingVote) {
      // User has already voted, calculate the change
      voteChange = voteType - existingVote.vote_type;
    }

    // Insert/update the vote record
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .upsert({
        user_id: userId,
        question_id: questionId,
        vote_type: voteType
      }, {
        onConflict: 'user_id,question_id'
      })
    
    if (voteError) {
      return { data: null, error: voteError }
    }

    // Then, update the vote count in the questions table
    const { data: questionData, error: getError } = await supabase
      .from('questions')
      .select('votes')
      .eq('id', questionId)
      .single()
    
    if (getError) {
      return { data: voteData, error: getError }
    }

    const newVoteCount = (questionData.votes || 0) + voteChange
    const { error: updateError } = await supabase
      .from('questions')
      .update({ votes: newVoteCount })
      .eq('id', questionId)
    
    return { data: voteData, error: updateError }
  },

  async voteAnswer(userId: string, answerId: number, voteType: number) {
    // First, check if user has already voted
    const { data: existingVote, error: getVoteError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', userId)
      .eq('answer_id', answerId)
      .single()
    
    let voteChange = voteType;
    if (!getVoteError && existingVote) {
      // User has already voted, calculate the change
      voteChange = voteType - existingVote.vote_type;
    }

    // Insert/update the vote record
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .upsert({
        user_id: userId,
        answer_id: answerId,
        vote_type: voteType
      }, {
        onConflict: 'user_id,answer_id'
      })
    
    if (voteError) {
      return { data: null, error: voteError }
    }

    // Then, update the vote count in the answers table
    const { data: answerData, error: getError } = await supabase
      .from('answers')
      .select('votes')
      .eq('id', answerId)
      .single()
    
    if (getError) {
      return { data: voteData, error: getError }
    }

    const newVoteCount = (answerData.votes || 0) + voteChange
    const { error: updateError } = await supabase
      .from('answers')
      .update({ votes: newVoteCount })
      .eq('id', answerId)
    
    return { data: voteData, error: updateError }
  }
}