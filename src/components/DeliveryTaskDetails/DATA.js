export const data = {
  _id: 42112,
  status: 'assigned',
  type: 'Drop Off',
  onfleetLink: 'link',
  onfleetDistance: '3.8',
  googleMapsDistance: '3.8',
  price: 4.70,
  courier: {
    _id: '60c95cbfde1ccb8958e17b50',
    fullName: 'Carmelita Marsham',
  },
  adjustment: [
    {
      createdAt: '2021-01-27T14:23:23.683Z',
      oldPrice: 6.55,
      newPrice: 6.55,
      for: 'Pharmacy',
      user_id: '',
      user_fullName: 'Alexa Tenorio',
    },
    {
      createdAt: '2021-01-27T14:23:23.683Z',
      oldPrice: 6.55,
      newPrice: 6.55,
      for: 'Pharmacy',
      user_id: '',
      user_fullName: 'Alexa Tenorio',
    }
  ],
  order: {
    _id: '60d58e1101b59e03e290b82f',
    uuid: '18719857',
    window: '2021-01-27T14:23:23.683Z',
    note: 'Fragile, please be careful',
  },
  timeline: [
    {
      type: 'created',
      createdAt: '2021-01-27T14:23:23.683Z',
    },
    {
      type: 'assigned',
      createdAt: '2021-01-27T14:23:23.683Z',
    },
    {
      type: 'started',
      createdAt: '2021-01-27T14:23:23.683Z',
    },
    {
      type: 'completed',
      createdAt: '2021-01-27T14:23:23.683Z',
      signature: 'https://cdn.globaldialog.ru/_/manager/files/571/77216e7d18/img-academy-2.jpg',
      photo: 'https://cdn.globaldialog.ru/_/manager/files/571/77216e7d18/img-academy-2.jpg',
      note: 'The client refused to go out, left the parcel at the door',
    },
  ]
}

