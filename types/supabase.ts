export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      decks: {
        Row: {
          color: string | null
          id: number
          name: string
          parent_deck: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          id?: number
          name: string
          parent_deck?: number | null
          user_id?: string
        }
        Update: {
          color?: string | null
          id?: number
          name?: string
          parent_deck?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decks_parent_deck_fkey"
            columns: ["parent_deck"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          expo_push_token: string | null
          id: number
          name: string
          pro: boolean
          user_uid: string
        }
        Insert: {
          email: string
          expo_push_token?: string | null
          id?: never
          name: string
          pro: boolean
          user_uid: string
        }
        Update: {
          email?: string
          expo_push_token?: string | null
          id?: never
          name?: string
          pro?: boolean
          user_uid?: string
        }
        Relationships: []
      }
      words: {
        Row: {
          deck: number
          id: number
          knowledgelevel: number
          meaning: string
          parent_deck: number | null
          pronunciation: string
          word: string
        }
        Insert: {
          deck: number
          id?: number
          knowledgelevel: number
          meaning: string
          parent_deck?: number | null
          pronunciation: string
          word: string
        }
        Update: {
          deck?: number
          id?: number
          knowledgelevel?: number
          meaning?: string
          parent_deck?: number | null
          pronunciation?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_deck_fkey"
            columns: ["deck"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "words_parent_deck_fkey"
            columns: ["parent_deck"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_words_by_parent_deck: {
        Args: {
          parent_deck_id: number
          words_limit: number
          revise: boolean
        }
        Returns: {
          deck: number
          id: number
          knowledgelevel: number
          meaning: string
          parent_deck: number | null
          pronunciation: string
          word: string
        }[]
      }
      get_random_words_from_deck: {
        Args: {
          deck_id: number
          is_parent_deck: boolean
          words_limit: number
          revise: boolean
        }
        Returns: {
          deck: number
          id: number
          knowledgelevel: number
          meaning: string
          parent_deck: number | null
          pronunciation: string
          word: string
        }[]
      }
      limited_words: {
        Args: {
          deck_ids: number[]
          revise: boolean
          words_limit: number
        }
        Returns: {
          deck: number
          id: number
          knowledgelevel: number
          meaning: string
          parent_deck: number | null
          pronunciation: string
          word: string
        }[]
      }
      random_words: {
        Args: {
          count: number
          deck_ids: number[]
        }
        Returns: {
          deck: number
          id: number
          knowledgelevel: number
          meaning: string
          parent_deck: number | null
          pronunciation: string
          word: string
        }[]
      }
      words_to_learn:
        | {
            Args: {
              deck_ids: number[]
              revise: boolean
              index_from: number
              index_to: number
            }
            Returns: {
              deck: number
              id: number
              knowledgelevel: number
              meaning: string
              parent_deck: number | null
              pronunciation: string
              word: string
            }[]
          }
        | {
            Args: {
              deck_ids: number[]
              revise: boolean
              words_limit: number
            }
            Returns: {
              deck: number
              id: number
              knowledgelevel: number
              meaning: string
              parent_deck: number | null
              pronunciation: string
              word: string
            }[]
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
