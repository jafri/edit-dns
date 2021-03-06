import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile, mkdirSync, readlink, unlink, exists } from 'fs'
import * as path from 'path'

export const nonSudoExec = promisify(exec)
export const readFileAsync = promisify(readFile)
export const writeFileAsync = promisify(writeFile)
export const readlinkAsync = promisify(readlink)
export const unlinkAsync = promisify(unlink)
export const existsAsync = promisify(exists)

export const readFileAsLines = async (path: string) => {
  const data = await readFileAsync(path, 'utf8')
  return data.split('\n')
}

export const escapeRegExp = (text: string) => {
  return text.replace(/["]/g, '\\$&')
}

export const mkkdirRecursive = (targetDir: string) => {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = '.'

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      mkdirSync(curDir)
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`)
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err // Throw if it's just the last created dir.
      }
    }

    return curDir
  }, initDir)
}
