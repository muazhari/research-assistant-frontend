// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './main'

const container = document.querySelector('#root')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const root = createRoot(container)

root.render(<Main />)
