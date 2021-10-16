export class UserProfile {
  initials?: string
  pictureUrl?: string
  constructor (readonly id: string) {}

  setPicture ({ name, pictureUrl }: {name?: string, pictureUrl?: string}): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined && name !== '') {
      const letters = name.match(/\b(.)/g)!
      if (letters.length > 1) {
        this.initials = `${letters?.shift()!.toUpperCase()}${letters?.pop()!.toUpperCase()}`
      } else {
        this.initials = name.substr(0, 2).toUpperCase()
      }
    }
  }
}
