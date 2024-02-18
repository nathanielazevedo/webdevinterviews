export default class Workout {
  constructor({
    id,
    title,
    difficulty,
    sp_template: type,
    youtube_link: youtubeLink,
    dynamo_data: files,
    is_owner: isOwner,
  }) {
    this.id = id
    this.title = title
    this.difficulty = difficulty
    this.type = type.name
    this.youtubeLink = youtubeLink
    this.files = files
    this.isOwner = isOwner
  }
}
