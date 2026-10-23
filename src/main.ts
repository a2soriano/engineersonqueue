import { mount } from 'svelte';
import App from './App.svelte';
import { startSiteVersionCheck } from './site-version';
import './style.css';
mount(App, { target: document.getElementById('app')! });

startSiteVersionCheck();
