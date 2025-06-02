import nothing from "../assets/images/nothing.svg";

const bgColor = "transparent";

const Noresult = () => {
  return (
    <div className="flex items-center justify-center flex-col text-center p-2.5 font-bold"
    style={{background: bgColor}}>
      <img className="w-35" src={nothing} alt="noresult-image" />
      <span className="m-4 text-2xl text-white">Something went wrong</span>
      <p className="text-white px-10 text-[#333] text-[16px]">We&apos;re unable to retrieve the weather details. Ensure you&apos;ve entered a valid city or try again later.</p>
    </div>
  )
}

export default Noresult
