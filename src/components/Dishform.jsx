import React from 'react'

const Dishform = () => {
  return (
   <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4 bg-gray-100 rounded shadow">
      <div>
        <label className="block mb-1">Dish Name</label>
        <input
          {...register('dish', { required: 'Dish name is required' })}
          className="w-full p-2 border rounded"
          placeholder="Enter dish name"
        />
        {errors.dish && <p className="text-red-500 text-sm">{errors.dish.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          {...register('price', { required: 'Price is required', min: 1 })}
          className="w-full p-2 border rounded"
          placeholder="Enter price"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', { required: 'Image is required' })}
          className="w-full"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>

      </div>
  )
}

export default Dishform
