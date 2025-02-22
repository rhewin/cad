import postmanToOpenApi from 'postman-to-openapi'
import cfg from '@/config'
import fs from 'fs'
import yaml from 'js-yaml'
import { swagger } from '@elysiajs/swagger'
import { log } from '@/packages'
import { resolve } from 'path'
import { attempt } from '@/utils/helper.util'
import { jsonOk, jsonError } from '@/base/base.api'

const filesDir = resolve(import.meta.dir, '../files')

const loadSwaggerYaml = async () => {
  const swaggerFilePath = resolve(filesDir, 'collection.yaml')
  if (!fs.existsSync(swaggerFilePath)) {
    log.warn('collection.yaml not found. Generating new one...')
    await toSwaggerYaml()
  }

  return yaml.load(fs.readFileSync(swaggerFilePath, 'utf8')) as object
}

const toSwaggerYaml = async () => {
  const input = resolve(filesDir, `${cfg.APP_NAME}.postman_collection.json`)
  const output = resolve(filesDir, 'collection.yaml')

  const res = await attempt(() => postmanToOpenApi(input, output, cfg.SWAGGER_OPT))

  if (res.error) {
    log.error('Error converting Postman collection:', res.error)
    return jsonError()
  }

  log.info(`OpenAPI specs saved to: ${output}`, res.data)
  return jsonOk(null)
}

const initSwagger = swagger({ documentation: await loadSwaggerYaml() })

export { initSwagger, loadSwaggerYaml, toSwaggerYaml }
