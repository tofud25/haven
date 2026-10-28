/**
 * Pollinations AI: Free, high-speed, unauthenticated AI image generator
 * Powers dynamic photo generation for Bloomr social feed posts.
 */

export interface ImageGenOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  model?: 'flux' | 'flux-realism' | 'flux-anime' | 'turbo';
  enhance?: boolean;
}

export class PollinationsClient {
  private static BASE_URL = 'https://image.pollinations.ai/prompt';

  /**
   * Generates a direct URL for an AI generated image.
   * Format: https://image.pollinations.ai/prompt/{encoded_prompt}?width=...&height=...&model=...
   */
  public static getImageUrl(options: ImageGenOptions): string {
    const {
      prompt,
      width = 800,
      height = 600,
      seed = Math.floor(Math.random() * 9999999),
      model = 'flux',
      enhance = true,
    } = options;

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const query = new URLSearchParams({
      width: String(width),
      height: String(height),
      seed: String(seed),
      model,
      enhance: enhance ? 'true' : 'false',
      nologo: 'true',
    });

    return `${this.BASE_URL}/${encodedPrompt}?${query.toString()}`;
  }

  /**
   * Generates a contextual prompt for an NPC social post.
   */
  public static createSocialPostPrompt(characterName: string, activity: string, location: string): string {
    return `masterpiece, high quality anime semi-realistic art, ${characterName} in ${location}, ${activity}, aesthetic lighting, cinematic composition, depth of field, vibrant colors, detailed clothing and environment`;
  }
}
