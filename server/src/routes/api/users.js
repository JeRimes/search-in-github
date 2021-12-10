import { Router } from "express";
import { PrismaClient } from '@prisma/client'
const api = Router();
const axios = require('axios');

const prisma = new PrismaClient();

function axiosGetDataUser(username) {
  // create a promise for the axios request
  const promise = axios.get('https://api.github.com/users/' + username,
    {
      headers: {
        'Authorization': `token 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`
      }
    }
  )
  // using .then, create a new promise which extracts the data
  const dataPromise = promise.then((response) => response.data)
  // return it
  return dataPromise
}

api.get("/:username", async (request, response) => {
  const { username } = request.params;
  //search in db if exist
  const userAlreadyAdded = await prisma.user.findUnique({
    where: {
      login: username.toLowerCase(),
    },
  })
  if (userAlreadyAdded == null) {
    const githubUser = await axiosGetDataUser(username)
    await prisma.user.create({
      data: {
        login: githubUser.login.toLowerCase(),
        name: githubUser.name,
        node_id: githubUser.node_id,
        avatar_url: githubUser.avatar_url,
        html_url: githubUser.html_url,
        bio: githubUser.bio,
        company: githubUser.company,
        blog: githubUser.blog,
        location: githubUser.location,
        email: githubUser.email,
        // hireable: githubUser.hireable,
        twitter_username: githubUser.twitter_username,
        public_repos: githubUser.public_repos,
        public_gists: githubUser.public_gists,
        followers: githubUser.followers,
        following: githubUser.following,
        created_at: githubUser.created_at,
        updated_at: githubUser.updated_at
      },
    })
  }

  const userAdded = await prisma.user.findUnique({
    where: {
      login: username.toLowerCase(),
    },
  })

  response.json({ userAdded })

});

export default api;
