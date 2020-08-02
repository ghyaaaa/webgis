import Vue from 'vue'
import Router from 'vue-router'
import cesiumContainer from '@/components/cesiumContainer';
import Custom from '@/components/custom';
import Fuzzy from '@/components/fuzzy';
import Porject from '@/components/new';

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        component: cesiumContainer,
        children: [
        
      ]
    },
    {
        path: '/custom',
        component: Custom,
    },
    {
        path: '/fuzzy',
        component: Fuzzy,
	},
	{
		path: '/porject',
		component: Porject
	}
  ]
})

