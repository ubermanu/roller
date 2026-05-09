import { mount } from 'svelte'
import 'webext-base-css/webext-base.css'
import OptionsPage from './components/OptionsPage.svelte'
import './i18n'

mount(OptionsPage, { target: document.body })
