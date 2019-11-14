const express = require('express');
const knex = require('knex');
const { DATABASE_URL } = require('../config');

const notefulRouter = express.Router();
const jsonParser = express.json()

const knexInstance = knex({
    client: 'pg',
    connection: DATABASE_URL,
});

notefulRouter
    .route('/api/folder')
    .get((req, res, next) => {
        knexInstance
            .select('*')
            .from('folders')
            .then(results => {
                res.status(200).json(results)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name} = req.body
        const newFolder = {name}

        knexInstance
            .insert(newFolder)
            .into('folders')
            .return(newFolder)
            .then(results => {
                res.status(201).json(results)
            })
    })

notefulRouter
    .route('/api/note')
    .get((req, res, next) => {
        knexInstance
            .select('*')
            .from('notes')
            .then(results => {
                res.status(200).json(results)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name, content, modified, folderid} = req.body
        const newNote = {name, content, modified, folderid}

        knexInstance
            .insert(newNote)
            .into('notes')
            .return(newNote)
            .then(results => {
                res.status(201).json(results)
            })
            .catch(next)
    })

notefulRouter
    .route('/api/note/:id')
    .get((req, res, next) => {
        const {id} = req.params

        knexInstance
            .from('notes')
            .select('*')
            .where('id', id)
            .then(results => {
                res.status(200).json(results)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const {id} = req.params

        knexInstance
            .from('notes')
            .where('id', id)
            .delete()
            .then(deleted => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = notefulRouter;