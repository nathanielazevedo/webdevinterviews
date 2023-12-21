/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line max-classes-per-file
class SpTemplate {
  constructor(vals) {
    this.name = vals?.name || ''
  }
}

class Dependency {
  constructor({ id, name, version }) {
    this.id = id
    this.name = name
    this.version = version
  }
}

class WorkoutDependency {
  constructor({ dependency, dependencyId, id, workoutId }) {
    this.dependency = new Dependency(dependency)
    this.dependencyId = dependencyId
    this.id = id
    this.workoutId = workoutId
  }
}

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
    sp_template,
    sp_template_id: spTemplateId,
    title,
    updatedAt,
    workout_dependencies,
    dependencies,
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
    this.spTemplate = new SpTemplate(sp_template)
    this.spTemplateId = spTemplateId
    this.title = title
    this.updatedAt = updatedAt
    this.dependencies = dependencies
    this.workoutDependencies = workout_dependencies.map(
      (workout_dependency) => new WorkoutDependency(workout_dependency)
    )
    this.youtubeLink = youtubeLink
  }

  static fromArray(workoutsArray) {
    return workoutsArray.map((workoutData) => new Workout(workoutData))
  }
}

export class WorkoutList {
  constructor(workouts = []) {
    this.workouts = workouts
  }
}
