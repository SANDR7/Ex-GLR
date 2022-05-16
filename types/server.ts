export interface ApiUserMutations {
  // types of mutations you can take for querying from the database
  [m: string]: 'withPosts' | 'createPost';
}
