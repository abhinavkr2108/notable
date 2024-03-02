import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  //   throw new Error("OPENAI_API_KEY is not defined");
  console.error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAIApi(config);
export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant who is capable of generating intersting thumbnail images. Your output will be fetched to DALLE API and then converted to an image. Description should be minimalistic and creative.`,
        },
        {
          role: "user",
          content: `Please generate thumbnail description for my notebook whose title is ${name}`,
        },
      ],
    });
    const data = await response.json();
    console.log("SAMPLE DATA");
    console.log(data);
    const imageDescription = data.choices[0].message?.content;
    return imageDescription as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(imageDescription: string) {
  try {
    const response = await openai.createImage({
      prompt: imageDescription,
      n: 1,
      size: "256x256",
    });
    const data = await response.json();
    console.log("SAMPLE DATA");
    console.log(data);
    const imageUrl = data.data[0].url;
    return imageUrl as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
