/* eslint-disable import/no-cycle */
import SpTemplate from './spTemplate'
import WorkoutDependency from './workoutdependency'

export default class Dependency {
  constructor({
    id,
    name,
    spTemplate,
    spTemplateId,
    version,
    workoutDependencies,
  }) {
    this.id = id
    this.name = name
    this.spTemplate = new SpTemplate(spTemplate)
    this.spTemplateId = spTemplateId
    this.version = version
    this.workoutDependencies = workoutDependencies.map(
      (dependency) => new WorkoutDependency(dependency)
    )
  }
}
