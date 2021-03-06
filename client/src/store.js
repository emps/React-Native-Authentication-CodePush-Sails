import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import { persistStore, autoRehydrate } from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';

import appReducer from 'src/reducers';
import * as persistActionCreators from './services/persist/actions';

const enhancer = compose(
	applyMiddleware(
		thunk,
	),
	devTools()
);

const store = createStore(
	appReducer,
	enhancer,
	autoRehydrate(),
);

const saveAndLoadSessionFilter = createFilter(
  'services',
  ['session'],
  ['session']
);

export const persist = persistStore(store, {
	storage: AsyncStorage,
	blacklist: ['data'],
	transforms: [saveAndLoadSessionFilter],
}, () => store.dispatch(persistActionCreators.update({ isHydrated: true })));

export default store;
