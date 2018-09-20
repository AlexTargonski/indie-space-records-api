import { tryLogin } from '../auth';
import formatErrors from './errors';
import requiresAuth from '../permissions';

export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.User.findOne({ where: { id: user.id } })),
  },
  Mutation: {
    updateUser: async (parent, { id, hasProfile }, { models }) => {
     const user = await models.User.findOne({ where: { id } })
     if (!user) {
       throw new Error(`Couldn’t find author with id ${id}`);
     }

     user.hasProfile = hasProfile;
     return user.save;
   },
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET),
    signUp: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);

        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
