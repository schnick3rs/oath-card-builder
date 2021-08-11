import { nanoid } from 'nanoid';

export const state = () => ({
  list: [],
  cards: {},
  lastType: 'denizen',
});

export const getters = {
  cardIds: (state) => state.list,
  cardSets: (state) => state.list.map((id) => state.cards[id]),

  card: (state) => (id) => { return state.cards[id]; },

  lastType: (state) => state.lastType,
}

export const mutations = {

  setLastType(state, type) {
    state.lastType = type;
  },

  createDenizen(state, { id, name, suit }) {

    const cardId = id || nanoid(4);

    const newDenizen = {};
    Object.assign(newDenizen, createDenizen(cardId, name, suit));

    state.list.push(cardId);
    const newObj = {};
    newObj[cardId] = newDenizen;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

    return cardId;
  },

  createEdifice(state, { id, name, suit }) {

    const cardId = id || nanoid(4);

    const newCard = {};
    Object.assign(newCard, createEdifice(cardId, name, suit));

    state.list.push(cardId);
    const newObj = {};
    newObj[cardId] = newCard;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  createRelic(state, { id, name, defense }) {

    const cardId = id || nanoid(4);

    const newRelic = {};
    Object.assign(newRelic, createRelic(cardId, name, defense));

    state.list.push(cardId);
    const newObj = {};
    newObj[cardId] = newRelic;
    state.cards = {
      ...state.cards,
      ...newObj,
    };

  },

  createSite(state, { id, name, relics, capacity }) {

    const cardId = id || nanoid(4);

    const newSite = {};
    Object.assign(newSite, createSite(cardId, name, relics, capacity));

    state.list.push(cardId);
    const newObj = {};
    newObj[cardId] = newSite;
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

  deleteCard(state, cardId) {
    state.list = state.list.filter(item => item !== cardId);
    delete state.cards[cardId];
  },

}

export const actions = {

  async createCard({ commit }, type) {
    const id = nanoid(4);
    switch (type) {
      case 'denizen':
        const denizen = { id, name: 'Random Denizen', suit: 'arcane' };
        commit('createDenizen', denizen);
        break;
      case 'site':
        const site = { id, name: 'Random Site', relics: 1, capacity: 2 };
        commit('createSite', site);
        break;
      case 'relic':
        const relic = { id, name: 'Random Relic', defense: 2 };
        commit('createRelic', relic);
        break;
      case 'edifice':
        const edifice = { id, name: 'Random Edifice', suit: 'arcane' };
        commit('createEdifice', edifice);
        break;
    }
    return id;
  }

}

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

const createEdifice = (
  id = nanoid(7),
  name = 'some fancy name',
  suit = 'arcane',
  type = 'power',
  cost = null,
  modifer = null,
  text = 'some fancy text for {1}',
  image = ''
) => ({
  id,
  __type: 'edifice',
  front: {
    name,
    suit,
    restriction: 'site locked',
    type,
    modifer,
    cost,
    text,
    image,
  },
  ruined: {
    name,
    suit: 'ruined',
    restriction: 'site locked',
    type,
    modifer,
    cost,
    text,
    image,
  },
});

const createRelic = (
  id = nanoid(7),
  name = 'some relic name',
  defense = 3,
  type = 'power',
  modifer = '',
  cost = '',
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
  image = '',
  text = '',
  special = '',
) => ({
  id,
  __type: 'site',
  name,
  resources,
  relics,
  capacity,
  relicRecoverCost,
  image,
  text,
  special,
});
