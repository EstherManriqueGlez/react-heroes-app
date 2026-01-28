import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";


describe('getHeroAction', () => {

  test('should fetch hero data and return with full image URL', async () => {

    const result = await getHeroAction('clark-kent');
    const resultImage = result.image;

    console.log(result)

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(resultImage).toContain('http');
  
  });

  test('should throw an error if hero is not found', async () => {

    const idSlug = 'batman-2';

    const result = await getHeroAction(idSlug).catch((error) =>{
      expect(error).toBeDefined();
      expect(error.response.status).toBe(404);

    });

    expect(result).toBeUndefined();
  });

});