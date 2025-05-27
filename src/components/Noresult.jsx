import noresult from "../assets/images/no-result.svg";

const bgColor = "transparent";

const Noresult = () => {
  return (
    <div className="flex items-center justify-center flex-col text-center p-2.5"
    style={{background: bgColor}}>
      <img src={noresult} alt="noresult-image" />
      <span className="m-4 text-2xl font-semibold">Something went wrong</span>
      <p className="font-medium text-[14px]">We&apos;re unable to retrieve the weather details. Ensure you&apos;ve entered a valid city or try again later.</p>
    </div>
  )
}

export default Noresult
