export default class Workout {
  constructor({
    id,
    title,
    difficulty,
    type,
    youtube_link: youtubeLink,
    files,
    is_owner: isOwner,
  }) {
    this.id = id
    this.title = title
    this.difficulty = difficulty
    this.type = type
    this.youtubeLink = youtubeLink
    this.files = files
    this.isOwner = isOwner
  }
}
