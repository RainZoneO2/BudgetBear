import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

const Categories = () => {
  const [{data: categories, fetching, error }] = useFindMany(api.categories);

  if (fetching) return <div> Loading.. </div>
  if (error) return <div> Error loading categories: {error.message} </div>

  return (
    <div>
      {categories.map((categories) => (
      <div key={categories.id}>
        {categories.name}
      </div>
      ))}
    </div>
  )
}

export default Categories;