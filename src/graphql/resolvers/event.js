import formatErrors from './errors';
import requiresAuth from '../../permissions';

export default {
  Query: {
    allMyEvents: async (parent, args, { models, user }) => {
        const myProfile = await models.Profile.findOne({ where: { owner: user.id } });
        const myEvents = await models.Event.findAll({ where: { profileId: myProfile.id } });

        return myEvents;
      },

    viewEvent: async (parent, { eventId }, { models }) => {
        const event = await models.Event.findOne({ where: { id: eventId } });

        return event
      },

    events: async (parent, { offset, profileId }, { models }) => await models.Event.findAll({
      order : [['created_at', 'DESC']],
      where : {
        profile_id : profileId,
      },
      limit : 12,
      offset,
    }),
  },
  Mutation: {
    createEvent: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      if (args.price < 0) {
        return {
          ok: false,
          errors: [{ path: 'price', message: 'Price must be greater than 0' }],
        };
      }

      try {
        const currentProfile = await models.Profile.findOne({ where: { owner: user.id } });
        await models.Event.create({ ...args, profileId: currentProfile.id });

        return ({
          ok: true
        });
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),

    deleteEvent: requiresAuth.createResolver(async (parent, { eventId }, { models, user }) => {
      try {
        const currentProfile = await models.Profile.findOne({ where: { owner: user.id } });
        await models.Event.destroy({ where: { id: eventId, profileId: currentProfile.id } });

        return ({
          ok: true
        });
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),

    updateEvent: requiresAuth.createResolver(async (parent, { eventId, title, details, price, country, region, address, date }, { models, user }
      ) => {
      if (price < 0) {
        return {
          ok: false,
          errors: [{ path: 'price', message: 'Price must be greater than 0' }],
        };
      }

      const currentProfile = await models.Profile.findOne({ where: { owner: user.id } });
      const event = await models.Event.findOne({ where: { id: eventId, profileId: currentProfile.id  } });

      event.title = title;
      event.details = details;
      event.price = price;
      event.country = country;
      event.region = region;
      event.address = address;
      event.date = date;

      const sameEvent = await models.Event.findOne({ where: { title: title } });

      if (!sameEvent || (sameEvent.id === event.id)) {
         event.save();
      } else {
        return {
          ok: false,
          errors: [{ path: 'title', message: 'title must be unique' }],
        };
      }

      return ({
        ok: true
      });
    }),
  },
};
