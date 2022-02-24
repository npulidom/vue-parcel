/**
 * App
 */

<script>

export default {

	name: "App",
}
</script>

<template lang="pug">

#app

	//- Router
	router-view(v-slot="{ Component }")
		transition(name="fade" mode="out-in")
			component(:is="Component")

</template>

<style lang="stylus" scoped>

#app
	width 100vw
	min-height 100vh

</style>
