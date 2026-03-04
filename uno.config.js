// unocss.config.js
import { defineConfig, presetIcons, presetUno } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      warn: true,
      prefix: ['i-'],
      extraProperties: {
        display: 'inline-block',
      },
      collections: {
        custom: FileSystemIconLoader('src/assets/icons')
      }
    })
  ]
})
