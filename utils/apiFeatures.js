class APIFeatures {
  constructor(query, queryString) {
    this.query = query,
    this.queryString = queryString
  }

  filter() {
    // 1A) Filtering *Ex: /api/v1/tours?duration=5&difficulty=easy&page=2
    let queryObj = {...this.queryString};
    let filterObj = ['page', 'sort', 'limit', 'fields']
    filterObj.forEach(el => delete queryObj[el]); 

    // 1B) Advance Filtering *Ex: /api/v1/tours?duration[gte]=5&difficulty=easy&page=2
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting *Ex: /api/v1/tours?sort=price
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3) Field limiting *Ex: /api/v1/tours?fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() { 
    // 4) Pagination *Ex: /api/v1/tours?page=1&limit=3
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 10;
    let skip = (page - 1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;