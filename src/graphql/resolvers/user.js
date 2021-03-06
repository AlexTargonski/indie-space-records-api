import { tryLogin } from '../../auth';
import formatErrors from './errors';
import requiresAuth from '../../permissions';

export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: (parent, args, { models, user }) => {

      return models.User.findById(user.id)
    },
  },
  Mutation: {
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
