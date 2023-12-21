/* eslint-disable import/no-cycle */
import Dependency from './dependency'

export default class WorkoutDependency {
  constructor({ dependency, dependencyId, id, workoutId }) {
    this.dependency = new Dependency(dependency)
    this.dependencyId = dependencyId
    this.id = id
    this.workoutId = workoutId
  }
}
