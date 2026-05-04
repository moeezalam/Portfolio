import generatedProjects from './projects.generated.json'
import manualProjects from './projects.manual.json'

const normalizeTags = (project) => {
  const tags = new Set()

  if (project.language) {
    tags.add(project.language)
  }

  if (Array.isArray(project.topics)) {
    project.topics.forEach((topic) => tags.add(topic))
  }

  if (Array.isArray(project.tags)) {
    project.tags.forEach((tag) => tags.add(tag))
  }

  return Array.from(tags)
}

export const getProjects = () => {
  const manualMap = new Map(
    manualProjects.map((project) => [project.repo ?? project.name, project]),
  )

  const merged = generatedProjects.map((project) => {
    const override = manualMap.get(project.name)

    return {
      ...project,
      ...override,
      tags: normalizeTags({ ...project, ...override }),
    }
  })

  const manualOnly = manualProjects.filter((project) => {
    const targetName = project.repo ?? project.name
    return !generatedProjects.some((generated) => generated.name === targetName)
  })

  const combined = [...merged, ...manualOnly]
    .filter((project) => project.hidden !== true)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
    })

  return combined
}
