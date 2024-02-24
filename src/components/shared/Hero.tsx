import Image from "next/image";
// import heroImg from "../public/img/hero.png";
import heroImg from "../../../public/img/hero.png";
import Container from "./Container";
import { Button } from "../ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Welcome to Notable
            </h1>
            <p className="py-5 text-md leading-normal text-gray-500 lg:text-lg xl:text-lg dark:text-gray-300">
              Your intelligent companion for seamless note-taking. MindSync
              utilizes cutting-edge AI technology to revolutionize the way you
              capture, organize, and recall your thoughts. With its intuitive
              interface and powerful features, MindSync effortlessly transforms
              your scattered ideas into structured notes, helping you stay
              focused and productive throughout your day.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <Link href={"/dashboard"}>
                <Button className="px-8 font-bold">Get Started</Button>
              </Link>
              <Button variant={"secondary"} className="px-8 font-bold">
                Know More
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Hero;
