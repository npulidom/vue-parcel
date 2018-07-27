/**
 * Section
 */

<style lang="stylus">

.section
	padding 20px
	color green

</style>

<template lang="pug">

div.section
	p {{ text }}
	router-link(to="/") Go to Home

</template>

<script>
export default {
	name : "Section",
	data : () => ({ text : "Hello World from Section!" })
}
</script>
