import './styles.css'

interface UserCardProps {
  name: string
  age: number
  image: string
}

export default function UserCard({
  name,
  age,
  image
}: UserCardProps) {
  return (
    <div className="user-card">
      <img src={image} alt={name} />

      <div>
        <h3>{name}</h3>
        <p>{age} anos</p>

        <span>Ativa</span>
      </div>
    </div>
  )
}