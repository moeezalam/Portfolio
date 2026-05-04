import fs from 'node:fs/promises'
import path from 'node:path'

const username = process.env.GITHUB_USER ?? 'moeezalam'
const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`

const outputPath = path.resolve(
  'src',
  'data',
  'projects.generated.json',
)

try {
  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`)
  }

  const repos = await response.json()
  const projects = repos
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description ?? '',
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics ?? [],
      language: repo.language,
      updated_at: repo.updated_at,
      stars: repo.stargazers_count,
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

  await fs.writeFile(
    outputPath,
    `${JSON.stringify(projects, null, 2)}\n`,
    'utf-8',
  )

  console.log(`Saved ${projects.length} projects to ${outputPath}`)
} catch (error) {
  console.warn('GitHub fetch failed, keeping existing project data.')
  console.warn(error?.message ?? error)
}
