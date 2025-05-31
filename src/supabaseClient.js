import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 環境変数のチェック
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Invalid VITE_SUPABASE_URL:', supabaseUrl)
  throw new Error('VITE_SUPABASE_URL must be a valid HTTPS URL')
}

if (!supabaseAnonKey) {
  console.error('Invalid VITE_SUPABASE_ANON_KEY:', supabaseAnonKey)
  throw new Error('VITE_SUPABASE_ANON_KEY is required')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export async function handleAuth({
  email,
  password,
  user_id,
  group_id,
  birth_year,
  gender,
  isLogin,
}) {
  try {
    let authResult;
    
    isLogin = isLogin || (!user_id && !group_id && !birth_year && !gender);

    if (isLogin) {
      // ログイン処理
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      authResult = data;
    } else {
      // サインアップ処理 - Supabase側でプロフィールデータの保存を行う関数が作成された仕様に合わせる
      console.log('Signing up with specified format:', { group_id, birth_year, gender, email });
      
      // 指定の仕様に合わせてサインアップ
      console.log('サインアップデータ:', { email, password, user_id, group_id, birth_year, gender });
      
      // Supabaseの最新バージョンに合わせた形式
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            group_id: String(group_id || ''),
            birth_year: String(birth_year || ''),
            gender: String(gender || '')
          }
        }
      });

      if (error) {
        console.error('サインアップエラー:', error.message);
        if (error.message.includes('already registered')) {
          throw new Error('User already exists. Please login instead.');
        }
        console.error('Signup error details:', error);
        throw error;
      } else {
        console.log('サインアップ成功:', data);
        authResult = data;
        console.log('Auth signup successful');
        
        // サインアップ成功後、REST APIを使用してプロファイルを作成
        try {
          console.log('プロファイル作成開始:', authResult.user.id);
          
          // REST APIを使用してプロファイルテーブルに直接挿入
          const { data: profileData, error: profileError } = await supabase
            .from('profile')
            .insert([
              { 
                id: authResult.user.id,  // auth.users.idと紐づけ
                email: String(email || ''),
                group_id: String(group_id || ''),
                user_id: String(user_id || ''),
                birth_year: String(birth_year || ''),
                gender: String(gender || '')
              }
            ])
            .select();
          
          if (profileError) {
            console.error('プロファイル作成エラー:', profileError);
          } else {
            console.log('プロファイル作成成功:', profileData);
          }
        } catch (profileCreateError) {
          console.error('プロファイル作成中に例外が発生:', profileCreateError);
          console.warn('プロファイル作成に失敗しましたが、認証は成功しました');
        }
        
        console.log('ユーザーID:', authResult.user.id);
        console.log('ユーザーメタデータ:', authResult.user.user_metadata);
      }
      
    }

    // ユーザーデータの返却処理
    if (isLogin) {
      // ログイン時はプロファイルテーブルからデータを取得
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('user_id, group_id')
          .eq('id', authResult.user.id)
          .single();
        
        if (profileError) {
          console.error('プロファイル取得エラー:', profileError);
          // プロファイル取得に失敗した場合はメタデータから取得
          return {
            success: true,
            data: {
              user_id: authResult.user.user_metadata.user_id || '',
              group_id: authResult.user.user_metadata.group_id || '',
            },
          };
        }
        
        console.log('プロファイル取得成功:', profileData);
        return {
          success: true,
          data: {
            user_id: profileData.user_id || '',
            group_id: profileData.group_id || '',
          },
        };
      } catch (error) {
        console.error('プロファイル取得中に例外が発生:', error);
        // 例外発生時はメタデータから取得
        return {
          success: true,
          data: {
            user_id: authResult.user.user_metadata.user_id || '',
            group_id: authResult.user.user_metadata.group_id || '',
          },
        };
      }
    } else {
      // サインアップ時は入力された値を使用
      return {
        success: true,
        data: {
          user_id: user_id || '',
          group_id: group_id || '',
        },
      };
    }
  } catch (error) {
    console.error('Error in auth process:', error);
    return {
      success: false,
      data: null,
      error: { code: 400, message: error.message },
    };
  }
}