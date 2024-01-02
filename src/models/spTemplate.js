/* eslint-disable import/no-cycle */
import Dependency from './dependency'

export default class SpTemplate {
  constructor({ dependencies, id, name }) {
    this.dependencies = dependencies.map(
      (dependency) => new Dependency(dependency)
    )
    this.id = id
    this.name = name
  }
}
