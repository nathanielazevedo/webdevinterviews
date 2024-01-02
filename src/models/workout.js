import SpTemplate from './spTemplate'

export default class Workout {
  constructor({
    accessLevel,
    author_id: authorId,
    author,
    created_at: createdAt,
    difficulty,
    id,
    image_link: imageLink,
    public: isPublic,
    sp_template: spTemplate,
    sp_template_id: spTemplateId,
    title,
    updatedAt,
    youtube_link: youtubeLink,
  }) {
    this.accessLevel = accessLevel
    this.authorId = authorId
    this.author = author
    this.createdAt = createdAt
    this.difficulty = difficulty
    this.id = id
    this.imageLink = imageLink
    this.isPublic = isPublic
    this.spTemplate = new SpTemplate(spTemplate)
    this.spTemplateId = spTemplateId
    this.title = title
    this.updatedAt = updatedAt
    this.youtubeLink = youtubeLink
  }
}
