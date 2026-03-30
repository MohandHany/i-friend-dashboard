export interface Feedback {
  id: string
  name: string
  rating: number
  email: string
  phone: string
  message: string
}

export const mockFeedback: Feedback[] = [
  {
    id: "1",
    name: "Ahmed Sami Alawadi",
    rating: 5,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Great experience, highly recommend",
  },
  {
    id: "2",
    name: "Layla Mohamed Khattab",
    rating: 3,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "The service was okay, but could be better in terms of response time.",
  },
  {
    id: "3",
    name: "Youssef Emad Morad",
    rating: 4,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Very helpful support team. They solved my issue in no time.",
  },
  {
    id: "4",
    name: "Mariam Khaled Selim",
    rating: 3,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "I expected more features for the price. Hope to see updates soon.",
  },
  {
    id: "5",
    name: "Omar Hany Altayeb",
    rating: 3,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Simple and easy to use, but I encountered some bugs on mobile.",
  },
  {
    id: "6",
    name: "Nouran Ahmed Fawzy",
    rating: 5,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Absolutely amazing! Best dashboard I've used so far.",
  },
  {
    id: "7",
    name: "Samer Alaa Aljundi",
    rating: 4,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Good experience overall, the interface is clean and intuitive.",
  },
  {
    id: "8",
    name: "Hadeel Tarek Saber",
    rating: 5,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Everything is perfect. Highly satisfied with the results.",
  },
  {
    id: "9",
    name: "Kareem Mahmoud Albadr",
    rating: 4,
    email: "info@gmail.com",
    phone: "+0201000000000",
    message: "Very stable and performant. Definitely worth the switch.",
  },
]
