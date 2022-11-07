import mongoose from "mongoose"
export async function getData({ search = "", page = 0, asc = 1, sort = "name", limit = 10 }, exact = []) {
    const n = {
        Book: ["author", "category"],
        Lend: ["book", "student"]
    }
    const a = {
        Book: ["author.name", "category.name"],
        Lend: ["book.name", "student.name", "status"]
    }
    const regExp = new RegExp(search, "i")
    const object = {}
    for (let property of exact) {
        if (property.name.includes("id")) object[property.name] = mongoose.Types.ObjectId(property.value)
        else object[property.name] = property.value
    }
    const nested = (n[this.modelName] || []).map(n => {
        let prural = n
        if (/y$/.test(n)) prural = prural.replace(/y$/, "ies")
        else prural += "s"
        return [{ $lookup: { from: prural, localField: n, foreignField: "_id", as: n } }, { $unwind: `$${n}` }]
    }).flat()
    const atrributes = (a[this.modelName] || []).map(attribute => ({ [attribute]: regExp }))
    let $match = { ...object, $or: [{ name: regExp }, ...atrributes] }
    const response = await this.aggregate([
        ...nested,
        {
            $facet: {
                results: [
                    { $match },
                    { $sort: { [sort]: asc } },
                    { $skip: page * limit },
                    { $limit: limit }
                ],
                totalCount: [
                    { $match },
                    { $count: 'totalCount' }
                ]
            }
        }
    ])
    const { results, totalCount } = response[0]
    const count = totalCount[0] ? totalCount[0].totalCount : 0
    return { count, results }
}


async function create(_, props) {
    let object = Object.values(props)[0]
    if (object._id) object = await this.findByIdAndUpdate(object._id, object, { new: true })
    else object = await this.create(object)
    const { count, results } = await getData.bind(this)({}, [{ name: "_id", value: object._id }])
    return results[0]
}
async function del(_, { _id }) {
    await this.findByIdAndDelete(_id)
    return _id
}
async function prural(_, { filter = {}, exact = [] }) {
    return await getData.bind(this)(filter, exact)
}
async function singular(_, { _id }) {
    const { count, results } = await getData.bind(this)({}, [{ name: "_id", value: _id }])
    return results[0]
}

export function assingResolvers(...models) {
    const resolvers = {
        mutations: {},
        querys: {}
    }
    for (let model of models) {
        resolvers.mutations[`create${model.modelName}`] = create.bind(model)
        resolvers.mutations[`delete${model.modelName}`] = del.bind(model)
        resolvers.querys[`${model.modelName.toLowerCase()}s`] = prural.bind(model)
        resolvers.querys[`${model.modelName.toLowerCase()}`] = singular.bind(model)
    }
    return resolvers
}




