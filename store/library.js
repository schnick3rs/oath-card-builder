import { nanoid } from 'nanoid';

export const state = () => ({
  list: [],
  cards: {},
});

export const getters = {
  cardIds: (state) => state.list,
  cardSets: (state) => state.list.map((id) => state.cards[id]),

  card: (state) => (id) => { return state.cards[id]; },
}

export const mutations = {

  createDenizen(state, { name, suit }) {

    const id = nanoid(4);
    console.info(id)

    const newDenizen = {};
    Object.assign(newDenizen, createDenizen(id, name, suit));

    state.list.push(id);
    const newObj = {};
    newObj[id] = newDenizen;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  createRelic(state, { name, defense }) {

    const id = nanoid(4);
    console.info(id)

    const newRelic = {};
    Object.assign(newRelic, createRelic(id, name, defense));

    state.list.push(id);
    const newObj = {};
    newObj[id] = newRelic;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  createSite(state, { name, relics, capacity }) {

    const id = nanoid(4);
    console.info(id)

    const newSite = {};
    Object.assign(newSite, createSite(id, name, relics, capacity));

    state.list.push(id);
    const newObj = {};
    newObj[id] = newSite;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  saveCard(state, { id, card }) {
    const newObj = {};
    newObj[id] = card;
    state.cards = {
      ...state.cards,
      ...newObj,
    }
  },

}

export const actions = {}

const createDenizen = (
  id = nanoid(7),
  name = 'some fancy name',
  suit = 'arcane',
  restriction = undefined,
  type = 'power',
  cost = null,
  modifer = null,
  text = 'some fancy text for {1}',
  image = ''
) => ({
  id,
  __type: 'denizen',
  name,
  suit,
  restriction,
  type,
  modifer,
  cost,
  text,
  image,
});

const createRelic = (
  id = nanoid(7),
  name = 'some relic name',
  defense = 3,
  type = 'power',
  modifer = null,
  cost = null,
  text = 'some fancy text for {1}',
  image = ''
) => ({
  id,
  __type: 'relic',
  name,
  defense,
  type,
  modifer,
  cost,
  text,
  image,
});

const createSite = (
  id = nanoid(7),
  name = 'some site name',
  resources = '',
  relics = 1,
  capacity = 2,
  relicRecoverCost = '',
  image = ''
) => ({
  id,
  __type: 'site',
  name,
  resources,
  relics,
  capacity,
  relicRecoverCost,
  image,
});
