/**
 * App
 */

<script>

import Vue       from "vue"
import VueRouter from "vue-router"

import Home    from "./Home.vue"
import Section from "./Section.vue"

Vue.use(VueRouter)

// Routes
const routes = [

	{
		path     : "/",
		component:  Home
	},
	{
		path     : "/section",
		component: Section
	},
	// not found
	{
		path    : "*",
		redirect: "/"
	}
]

export default {

	name: "App",

	router: new VueRouter({ routes })
}
</script>

<template lang="pug">

#app

	transition(name="fade" mode="out-in" :duration="{ enter: 300, leave: 300 }" appear)
		router-view

</template>

<style lang="stylus">

#app
	min-height 100vh

</style>
