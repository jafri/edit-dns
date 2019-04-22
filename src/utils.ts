import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile } from 'fs'

export const nonSudoExec = promisify(exec)
export const readFileAsync = promisify(readFile)
export const writeFileAsync = promisify(writeFile)

export const readFileAsLines = async (path: string) => {
  const data = await readFileAsync(path, 'utf8')
  return data.split('\n')
}
